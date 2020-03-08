type Options = {
  scale?: number;
  width?: number;
  height?: number;
  name?: string;
  type?: string;
};

export default function skaler(
  file: File,
  { scale, width, height, name = file.name, type = file.type }: Options = {}
) {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const el = document.createElement("canvas");
        const dir = width < img.width || height < img.height ? "min" : "max";
        const stretch = width && height;
        const ratio = scale
          ? scale
          : Math[dir](width / img.width || 1, height / img.height || 1);
        const w = (el.width = stretch ? width : img.width * ratio);
        const h = (el.height = stretch ? height : img.height * ratio);
        const ctx = el.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        el.toBlob(blob =>
          res(new File([blob], name, { type, lastModified: Date.now() }))
        );
        reader.onerror = rej;
      };
      img.src = String(e.target.result);
    };
  });
}
