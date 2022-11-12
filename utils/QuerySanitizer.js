/**
 * @dev Database query built from user-controlled sources can be
 * mitigated using mongo-sanitize. Commonly known as SQL/No-SQL Injection.
 * Weakness: CWE-89, CWE-90, CWE-943
 */
 const sanitize = require('mongo-sanitize');

 module.exports = {
     sanitizeQueryInput: (_input) => {
         return sanitize(_input)
     }
 }