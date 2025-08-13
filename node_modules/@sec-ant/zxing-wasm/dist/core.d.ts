/// <reference types="emscripten" />
export type ZXingModuleType = "reader" | "writer";
export type ZXingModuleFactory<T extends ZXingModuleType = "reader" | "writer"> = EmscriptenModuleFactory<ZXingModule<T>>;
export type ZXingModuleFactoryTypeExtractor<F> = F extends ZXingModuleFactory<infer T> ? T : never;
export type ZXingModuleOverrides<T extends ZXingModuleType = ZXingModuleType> = Partial<ZXingModule<T>>;
export declare function setZXingModuleOverrides(zxingModuleOverrides: ZXingModuleOverrides): void;
export declare function getZXingModule<T extends ZXingModuleType>(zxingModuleFactory: ZXingModuleFactory<T>, zxingModuleOverrides?: Partial<ZXingModule<T>>): Promise<ZXingModule<T>>;
export declare function purgeZXingModule(): void;
interface ZXingReaderModule extends EmscriptenModule {
    readBarcodesFromImage(bufferPtr: number, bufferLength: number, tryHarder: boolean, formats: string, maxSymbols: number): ZXingVector<ZXingReadInnerOutput>;
    readBarcodesFromPixmap(bufferPtr: number, imgWidth: number, imgHeight: number, tryHarder: boolean, formats: string, maxSymbols: number): ZXingVector<ZXingReadInnerOutput>;
}
interface ZXingWriterModule extends EmscriptenModule {
    writeBarcodeToImage(text: string, format: string, encoding: string, margin: number, width: number, height: number, eccLevel: number): ZXingWriteInnerOutput;
}
export type ZXingModule<T extends ZXingModuleType = "reader" | "writer"> = T extends "reader" ? T extends "writer" ? ZXingReaderModule & ZXingWriterModule : ZXingReaderModule : T extends "writer" ? ZXingWriterModule : never;
export declare const ZXING_BARCODE_FORMAT_NAMES: readonly ["Aztec", "Codabar", "Code128", "Code39", "Code93", "DataBar", "DataBarExpanded", "DataMatrix", "EAN-13", "EAN-8", "ITF", "Linear-Codes", "Matrix-Codes", "MaxiCode", "MicroQRCode", "None", "PDF417", "QRCode", "UPC-A", "UPC-E"];
export type ZXingBarcodeFormat = (typeof ZXING_BARCODE_FORMAT_NAMES)[number];
export type ZXingReadInputBarcodeFormat = Exclude<ZXingBarcodeFormat, "None">;
export type ZXingWriteInputBarcodeFormat = Exclude<ZXingBarcodeFormat, "DataBar" | "DataBarExpanded" | "MaxiCode" | "MicroQRCode" | "None" | "Linear-Codes" | "Matrix-Codes">;
export type ZXingReadOutputBarcodeFormat = Exclude<ZXingBarcodeFormat, "Linear-Codes" | "Matrix-Codes">;
export declare const ZXING_CHARACTOR_SET_NAMES: readonly ["Cp437", "ISO-8859-1", "ISO-8859-2", "ISO-8859-3", "ISO-8859-4", "ISO-8859-5", "ISO-8859-6", "ISO-8859-7", "ISO-8859-8", "ISO-8859-9", "ISO-8859-10", "ISO-8859-11", "ISO-8859-13", "ISO-8859-14", "ISO-8859-15", "ISO-8859-16", "SJIS", "Shift_JIS", "Cp1250", "windows-1250", "Cp1251", "windows-1251", "Cp1252", "windows-1252", "Cp1256", "windows-1256", "UTF-16BE", "UTF-16LE", "UTF-32BE", "UTF-32LE", "UnicodeBigUnmarked", "UnicodeBig", "UTF-8", "ASCII", "US-ASCII", "Big5", "GB2312", "GB18030", "EUC-CN", "GBK", "EUC-KR", "BINARY"];
export type ZXingCharacterSet = (typeof ZXING_CHARACTOR_SET_NAMES)[number];
export type ZXingWriteInputECCLevel = -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type ZXingReadOutputECCLevel = "L" | "M" | "Q" | "H";
export interface ZXingPoint {
    x: number;
    y: number;
}
export interface ZXingPosition {
    bottomLeft: ZXingPoint;
    bottomRight: ZXingPoint;
    topLeft: ZXingPoint;
    topRight: ZXingPoint;
}
export interface ZXingVector<T> {
    size: () => number;
    get: (i: number) => T | undefined;
}
export interface ZXingReadInnerOutput {
    format: string;
    text: string;
    bytes: Uint8Array;
    error: string;
    position: ZXingPosition;
    symbologyIdentifier: string;
    eccLevel: ZXingReadOutputECCLevel;
    version: string;
    orientation: number;
    isMirrored: boolean;
    isInverted: boolean;
}
export interface ZXingWriteInnerOutput {
    image: Uint8Array | null;
    error: string;
    delete: () => void;
}
export interface ZXingReadOutput extends Omit<ZXingReadInnerOutput, "format"> {
    format: ZXingReadOutputBarcodeFormat;
}
export interface ZXingWriteOutput extends Omit<ZXingWriteInnerOutput, "image" | "delete"> {
    image: Blob | null;
}
export interface ZXingReadOptions {
    tryHarder?: boolean;
    formats?: ZXingReadInputBarcodeFormat[];
    maxSymbols?: number;
}
export interface ZXingWriteOptions {
    format?: ZXingWriteInputBarcodeFormat;
    charset?: ZXingCharacterSet;
    quietZone?: number;
    width?: number;
    height?: number;
    eccLevel?: ZXingWriteInputECCLevel;
}
export declare const defaultZXingReadOptions: Required<ZXingReadOptions>;
export declare const defaultZXingWriteOptions: Required<ZXingWriteOptions>;
export declare function readBarcodesFromImageFile<T extends "reader">(imageFile: Blob | File, { tryHarder, formats, maxSymbols, }: ZXingReadOptions | undefined, zxingModuleFactory: ZXingModuleFactory<T>): Promise<ZXingReadOutput[]>;
export declare function readBarcodesFromImageData<T extends "reader">(imageData: ImageData, { tryHarder, formats, maxSymbols, }: ZXingReadOptions | undefined, zxingModuleFactory: ZXingModuleFactory<T>): Promise<ZXingReadOutput[]>;
export declare function writeBarcodeToImageFile<T extends "writer">(text: string, { format, charset, quietZone, width, height, eccLevel, }: ZXingWriteOptions | undefined, zxingModuleFactory: ZXingModuleFactory<T>): Promise<ZXingWriteOutput>;
export {};
