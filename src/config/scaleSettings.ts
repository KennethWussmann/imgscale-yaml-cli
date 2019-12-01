import {ScaleOutput} from "./scaleOutput";

export interface ScaleSettings {
    pathPrefix?: string
    name: string
    input: string
    output: Array<ScaleOutput>
}
