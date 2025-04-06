const commonTags = [
  "name",
  "surname",
  "fatherName",
  "motherName",
  "passportNo",
  "countryCode",
  "registerNo",
  "jobTitle",
  "employeeId",
  "affiliation",
  "institution",
  "companyName",
  "researchAreas",
  "dateOfBirth",
  "identityNo",
  "address",
  "email",
  "education",
  "phone",
  "experience",
  "jobExperience",
  "workExperience",
  "listOfExperience",
  "publications",
  "skills",
  "eTin",
  "National Identity No",
  "Passport No",
  "Nationality",
  "University ID",
  "University Address",
  "University Phone",
  "University Department",
  "Form No",
  "Voter Area",
  "Voter Serial",
  "Voter No",
  "Status",
  "Blood Group",
  "Address",
  "Present Address",
  "Permanent Address",
  "registrationDate",
  "issueDate",
  "birthRegistration",
  "Gender",
  "birthPlace",
  "issuingAuthority",
];

const extract = `You are an AI assistant who can extract information from given text and label them.
                    Here is some information given in text format extracted from some source like Identity Card, Resume, Google scholar or any other social profile.
                    You task is to label them properly and return a json file.
  
                    Example of json format is
                    {
                      "name" : "",
                      "dateOfBirth" : ""
                    }

                    Points:
                    1. Here is some of the common information tag.  ${commonTags} Try to fill them with priority if possible and keep the tag name as it is.
                    2. If any information is missing use N/A for those label names. 
                    3. Even if there is no labelled information, extract ALL the information possible and properly label them in json format.
  
                    Instructions:
                    1. Don't add unncessary information or text before or after the output.
                    2. Don't imagine any data. Just extract from given input text.
                    3. Provide only the json as output.
                    4. Format text for better spacing and identation. Process gaps wisely for name, address, date of birth etc.
  
                    Note:
                    1. For Birth Certificate, Please read register no, Date of Registration and Date of Issue.`;

module.exports = {
  extract,
};
