import zxingModuleFactory from "./zxing_reader.js";
import { ZXingModuleFactoryTypeExtractor, ZXingModuleOverrides, getZXingModule as _getZXingModule, ZXingReadOptions, ZXingReadOutput } from "../core.js";
export declare function getZXingModule(zxingModuleOverrides?: ZXingModuleOverrides<ZXingModuleFactoryTypeExtractor<typeof zxingModuleFactory>>): ReturnType<typeof _getZXingModule>;
export declare function readBarcodesFromImageFile(imageFile: Blob | File, { tryHarder, formats, maxSymbols, }?: ZXingReadOptions): Promise<ZXingReadOutput[]>;
export declare function readBarcodesFromImageData(imageData: ImageData, { tryHarder, formats, maxSymbols, }?: ZXingReadOptions): Promise<ZXingReadOutput[]>;
export * from "../exposed.js";
