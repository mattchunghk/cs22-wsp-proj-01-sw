import formidable, { Files } from "formidable";
export const uploadDir = "uploads";
import express from "express";

const form = formidable({
  uploadDir,
  keepExtensions: true,
  maxFiles: 5,
  maxFileSize: 52428800,
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
        const title = fields.title;
        // const fromSocketId = fields.fromSocketId;
        let file = Array.isArray(files.image) ? files.image[0] : files.image;
        console.log(file);
        const filename = file ? file.newFilename : null;

        console.log({
          filename,
          title,
        });
        // Get File Name
        resolve({
          filename,
          title,
          //   fromSocketId,
        });
      } catch (error) {
        console.log("error in form parsing", error);
        reject(error);
      }
    });
  });
};
