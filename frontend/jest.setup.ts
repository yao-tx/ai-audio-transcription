import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

//@ts-ignore
Object.assign(global, { TextDecoder, TextEncoder });