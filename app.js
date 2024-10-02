import { createHelia } from "helia"
import { unixfs } from "@helia/unixfs"
import { car } from "@helia/car"
import { Readable } from "stream"
import { CarWriter, CarReader } from '@ipld/car'

const helia = helia(createHelia) //create helia node
const fs = unixfs(helia) //create filesystem
const c = car(helia) //create car file instance

const userSignature = "12345" 
const userPublicKey = "09876"

const encode = new TextEncoder()
const decode = new TextDecoder()

const encodedUserSignature = encode(userSignature)
const encodedUserPublicKey = encode(userPublicKey)

const userSignatureCid = await fs.addBytes(encodedUserSignature) //add bytes to filesystem
const userPublicKeyCid = await fs.addBytes(encodedUserPublicKey) //add bytes to filesystem

const {out, writer} = await CarWriter.create([userSignatureCid])
Readable.from(out).pipe(fs.createWriteStream(`${userPublicKey}.car`)) //create write stream

const {outAppend, writerAppend} = await CarWriter.createAppender([userPublicKeyCid])
Readable.from(outAppend).pipe(fs.createWriteStream(`${userPublicKey}.car`)) //create write stream

//write dag to file .export(cid,writer)
c.export(userSignatureCid, writer)
c.export(userPublicKeyCid, writerAppend)

//Testing read
const inStream = fs.createReadStream(`${userPublicKey}.car`)
const reader = await CarReader.fromIterable(inStream)

const roots = await reader.getRoots()
const got = await reader.get(roots[0])

console.log(roots)
console.log(decode(got))

async function sendFile() {
    try {
        response = await fetch("my-server"), {
            method: "POST",
            
        }
        if(response.ok) {
            return 200
        }
    } catch (error) {
        console.error(error, 400)
    }
}

//CAR IMPORT AFTER FETCH
//create helia node
//create filesystem
//create car file instance
//create read stream
//read from file
//import file to instance
