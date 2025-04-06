const extract = `Analyze the following text and extract **all form labels** including **checklist items**.
               - Maintain **hierarchical structure** (e.g., "Family Member 1 Given Names" under "Family Member 1").
               - Detect **checklist options**, ** supporting documents** and format them as **part of the main label**.
               - Detect **supporting documents** and format them as **part of the main label**.
               - Remove **newline characters (\n)** and replace them with a **space**.
               - If a checklist or gaps is under a label, write label name - checklist or gap name.
               - Do not skip any labels. Keep as many labels as possible. 

               Example Output (Text format):
                 "Identity Document Checklist - Australian Driver’s Licence",
                 "Identity Document Checklist - Passport",
                 "Identity Document Checklist - UNHCR Document",
                 "Identity Document Checklist - National Identity Card",
                 "Identity Document Checklist - Other Document with Signature and Photo",
                 "Supporting Document - Your Australian citizen parent’s",
                 "Family Member 1 Relationship to You",
                 "Family Member 1 Full Name",
                 "Family Member 1 Given Names",
                 "Family Member 1 Name in Chinese Commercial Code Numbers (if applicable)",
                 "Family Member 1 Place of Birth Town/City",
                 "Family Member 1 Place of Birth State/Province",
                 "Family Member 1 Place of Birth Country",
                 "Issuing Authority/ Place of Issue as Shown in Passport",
                 "Parent 2 - Relationship to you",
                 "Parent 2 - Date of Birth",
                 
               Return only a **flat text list of labels**.`;

module.exports = {
  extract,
};
