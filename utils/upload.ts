import formidable, { Files } from "formidable";
export const uploadDir = "uploads";
import express from "express";

export const form = formidable({
  uploadDir,
  keepExtensions: true,
  maxFiles: 5,
  maxFileSize: 52428800,
  multiples: true,
  // the default limit is 200KB
  filter: (part) => part.mimetype?.startsWith("image/") || false,
});

export const formParse = (req: express.Request) => {
  return new Promise<any>((resolve, reject) => {
    // req.body => fields :36
    form.parse(req, (err, fields, files: Files) => {
      if (err) {
        console.log("err in form parsing", err);
        reject(err);
      }
      try {
        console.log(fields);
        const title = fields.title;
        const startDate = fields.startDate;
        const endDate = fields.endDate;
        const country = fields.country;
        const place = fields.place;
        const ppl = fields.ppl;
        const budget = fields.budget;
        const intro = fields.intro;
        const sporty = fields.sporty;
        const luxury = fields.luxury;
        const relaxed = fields.relaxed;
        const countrySide = fields.countrySide;

        // const fromSocketId = fields.fromSocketId;

        let file1 = Array.isArray(files.image1)
          ? files.image1[0]
          : files.image1;
        let file2 = Array.isArray(files.image2)
          ? files.image2[0]
          : files.image2;
        let file3 = Array.isArray(files.image3)
          ? files.image3[0]
          : files.image3;
        const filename1 = file1 ? file1.newFilename : null;
        const filename2 = file2 ? file2.newFilename : null;
        const filename3 = file3 ? file3.newFilename : null;

        // console.log({
        //   filename,
        //   title,
        // });
        // Get File Name
        resolve({
          filename1,
          filename2,
          filename3,
          title,
          startDate,
          endDate,
          country,
          place,
          ppl,
          budget,
          intro,
          sporty,
          luxury,
          relaxed,
          countrySide,

          //   fromSocketId,
        });
      } catch (error) {
        console.log("error in form parsing", error);
        reject(error);
      }
    });
  });
};
