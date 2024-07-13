export class CoverLetter {
  fromFName;
  fromLName;
  fromStreetAddress;
  fromPhoneNum;
  fromEmail;
  date;
  toName;
  toCompany1;
  toCompany2;
  toStreetAddress;
  fromHeaderInformation;
  par1;
  par2;
  par3;
  par4;
  constructor(fromFName = "", fromLName = "", fromStreetAddress = "", fromPhoneNum = "", fromEmail = "", toName = "", toCompany1 = "", toCompany2 = "", toStreetAddress = "", paragraphs = []) {
    this.fromFName = fromFName;
    this.fromLName = fromLName;
    this.fromStreetAddress = fromStreetAddress;
    this.fromPhoneNum = fromPhoneNum;
    this.fromEmail = fromEmail;
    this.date = new Date().toLocaleDateString();
    this.toName = toName;
    this.toCompany1 = toCompany1;
    this.toCompany2 = toCompany2;
    this.toStreetAddress = toStreetAddress;
    this.par1 = paragraphs[0] || "";
    this.par2 = paragraphs[1] || "";
    this.par3 = paragraphs[2] || "";
    this.par4 = paragraphs[3] || "";
    let headerInfo = [];
    if (fromStreetAddress.length > 0)
      headerInfo.push(fromStreetAddress);
    if (fromPhoneNum.length > 0)
      headerInfo.push(fromPhoneNum);
    if (fromEmail.length > 0)
      headerInfo.push(fromEmail);
    if (headerInfo.length > 0)
      this.fromHeaderInformation = headerInfo.join(" | ");
    else
      this.fromHeaderInformation = "";
  }
  getLetterName() {
    const date = new Date();
    return `${date.getTime()}-cover-letter.docx`;
  }
}