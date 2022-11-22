var fs = require("fs");
const expressAsyncHandler = require("express-async-handler");
const Marketplace = require("../models/Marketplace");
const Fixures = require("../models/Fixture");
const { imageKit } = require("../../utils/ImageKit");
const { sanitizeQueryInput } = require("../../utils/QuerySanitizer");

module.exports = {
  /**
   * @dev Get Specific Marketplaces
   */
  getSpecificMarketplace: expressAsyncHandler(async (req, res) => {
    res
      .json({
        marketplace: await Marketplace.findOne({
          marketplaceSlug: sanitizeQueryInput(req.params["marketplaceSlug"]),
        }),
      })
      .status(200);
  }),

  /**
   * @dev Get All Marketplaces
   */
  getMarketplaces: expressAsyncHandler(async (req, res) =>{
    const allMarketplace = await Marketplace.find();
    let fixturesCount = 0;
    allMarketplace.length > 0 && allMarketplace.map(async (_marketplace)=>{
        // fixturesCount += await Fixures.find({marketplaceSlug:_marketplace.marketplaceSlug}).count()
        _marketplace["fixtures"] = await Fixures.find({marketplaceSlug:_marketplace.marketplaceSlug}).countDocuments({})
        return _marketplace;
      })
    
      res.status(200).json({
        marketplaces: allMarketplace,
      })
  }

  ),

  /**
   * @dev New Marketplaces
   *
   * @dev Algorithm
   * 1. get formData inputs => req.body, req.file(from multer)
   * 2. read uploaded file and upload to ImageKit
   * 3. create new document on marketplace collection, marketplaceCoverImage is from imagekit uploaded result url
   * 4. delete image from local storage of server
   */
  // deepcode ignore NoRateLimitingForExpensiveWebOperation: Rate Limiting already configured on server.js
  newMarketplace: expressAsyncHandler(async (req, res) => {
    /**
     * @note fallback for marketplace is required
     */
    const { marketplaceName, marketplaceSlug, tags, teamType } = req.body;
    const { filename } = req.file;

    // deepcode ignore PT: Heroku won't expose file system
    fs.readFile(__basedir + "/uploads/" + filename, (err, data) => {
      if (err) throw err;

      imageKit.upload(
        {
          file: data,
          fileName: filename,
        },
        expressAsyncHandler(async (error, result) => {
          if (error) console.error(error);
          else {
            res.status(200).json({
              response: await Marketplace.create({
                marketplaceName,
                marketplaceSlug,
                marketplaceCoverImage: {
                  fileId: result.fileId,
                  url: result?.url,
                },
                // deepcode ignore HTTPSourceWithUncheckedType: <please specify a reason of ignoring this>
                tags: tags.split(","),
                teamType,
              }),
              message: "Marketplace created successfully!",
            });

            // deepcode ignore PT: <please specify a reason of ignoring this>
            fs.unlinkSync(__basedir + "/uploads/" + filename);
          }
        })
      );
    });
  }),

  /**
   * @dev Update Marketplace
   * @note marketplace coverimage can't be updated => after beta it must be done
   */
  updateMarketplace: expressAsyncHandler(async (req, res) => {
    const { marketplaceName, tags, teamType } = req.body;

    const query = {
      marketplaceSlug: sanitizeQueryInput(req.params["marketplaceSlug"]),
    };

    const tempMarketplace = await Marketplace.findOne(query);

    if (tempMarketplace)
      res.status(200).json({
        message: `Marketplace ${marketplaceSlug} updated successfully!`,
        response: await Marketplace.updateOne(query, {
          $set: {
            marketplaceName: marketplaceName || tempMarketplace.marketplaceName,
            /**
             * @dev marketplace slug must be able to be updated
             */
            marketplaceSlug,
            marketplaceCoverImage: tempMarketplace.marketplaceCoverImage,

            /**
             * @note marketplace cover image must be able to be updated
             * marketplaceCoverImage: marketplaceCoverImage || tempMarketplace.marketplaceCoverImage,
             */

            // deepcode ignore HTTPSourceWithUncheckedType: <please specify a reason of ignoring this>
            tags: tags.split(",") || tempMarketplace.tags,
            teamType: teamType || tempMarketplace.teamType,
          },
        }),
      });
    else
      res.status(400).json({
        message: "No marketplace, bad request! Try checking marketplace slug.",
        response: null,
      });
  }),

  /**
   * @dev Delete Marketplace
   */
  deleteMarketplace: expressAsyncHandler(async (req, res) => {
    const query = {
      marketplaceSlug: sanitizeQueryInput(req.params["marketplaceSlug"]),
    };

    const marketplace = await Marketplace.findOne(query).select(
      "marketplaceCoverImage"
    );

    if (marketplace) {
      await Marketplace.deleteOne(query);
      await imageKit.deleteFile(marketplace?.marketplaceCoverImage?.fileId);

      res.status(200).json({
        message: `Marketplace ${req.params["marketplaceSlug"]} deleted successfully!`,
      });
    } else {
      res.status(400).json({
        message: "No marketplace, bad request! Try checking marketplace slug.",
      });
    }
  }),
};
