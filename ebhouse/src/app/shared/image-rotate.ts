


import {
    createImageFromDataUrl, getImageTypeFromDataUrl, ImageFileProcessor
  } from "ngx-image2dataurl";

export class RotateImageFileProcessor implements ImageFileProcessor {
    async process(dataURL: string,srcOrientation : number): Promise<string> {
      const canvas = document.createElement('canvas');
      const image = await createImageFromDataUrl(dataURL);
      if (4 < srcOrientation && srcOrientation < 9) {
        canvas.width = image.height;
        canvas.height = image.width;
      } else {
        canvas.width = image.width;
        canvas.height = image.height;
      }
      const ctx = canvas.getContext("2d");
      switch (srcOrientation) {
        case 2:
          ctx.transform(-1, 0, 0, 1, image.width, 0);
          break;
        case 3:
          ctx.transform(-1, 0, 0, -1, image.width, image.height);
          break;
        case 4:
          ctx.transform(1, 0, 0, -1, 0, image.height);
          break;
        case 5:
          ctx.transform(0, 1, 1, 0, 0, 0);
          break;
        case 6:
          ctx.transform(0, 1, -1, 0, image.height, 0);
          break;
        case 7:
          ctx.transform(0, -1, -1, 0, image.height, image.width);
          break;
        case 8:
          ctx.transform(0, -1, 1, 0, 0, image.width);
          break;
        default:
          
          ctx.transform(1, 0, 0, 1, 0, 0);
      }
  
      ctx.save();
      ctx.drawImage(image, 0,0);
      ctx.restore();
      return canvas.toDataURL(getImageTypeFromDataUrl(dataURL));
    }
  }