const express=require('express');
const bodyParser = require('body-parser');
const crypto=require('crypto');
const app=express();

//middleware
app.use(bodyParser.json());

const PORT=3000;

app.listen(PORT, ()=>{
    console.log("Server is running"+{PORT});
});

//AES encryption
function encryptAES(data,aesKey){
    const initVector=crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', aesKey,initVector);
    let encrypted = cipher.update(data, 'ut8','hex');
    encrypted += cipher.final('hex');
        return { initVector: initVector.toString('hex'), encryptedData: encrypted };
    }


    //AES decryption
    function decryptAES(encryptedData, aesKey, initVector){
        const decipher = crypto.createDecipheriv('aes-256-cbc',aesKey,Buffer.from(initVector,'hex'));
        let decrypted=decipher.update(encryptedData,'hex','utf8');
        decrypted +=decipher.final('utf8');
        return decrypted;
    }

    const {publicEncrypt,privateDecrypt}=require('crypto');

    //RSA encryption
    function encryptRSA(aesKey,publicKey){
        const encryptedKey=publicEncrypt(publicKey,aesKey);
        return encryptedKey.toString('hex');
    }

    //RSA decryption
    function decryptRSA(encrypted_aesKey,privateKey){
        const encryptedBuffer=Buffer.from(encrypted_aesKey,'hex');
        const decrypted=privateDecrypt(privateKey,encryptedBuffer);
        return decrypted;
    }

    //API to encrypt data
    app.post('./create', async(requestAnimationFrame,res)=>{
        const {userAddress,data,meaning}=req.body;

        //1. Generate AES key
        const aesKey=crypto.randomBytes(32);
        //2. Encrypt data using AES
        const {initVector:wordIv, encryptedData: encryptedWord}=encryptAES(word,aesKey);
        const {initVector:meaningIV,encryptedData: encryptedMeaning}=encryptAES(meaning,aesKey);
        //3. Encrypt AES key using RSA
        const usrPublicKey= await getUserPublicKey(userAddress);
        const encryptedAESKey=encryptRSA(aesKey,usrPublicKey);
        //4. Save encrypted data to database
        await storeProposal(encryptedWord,encryptedMeaning,encryptedAESKey,userAddress)
        res.json({message:"data encrypted/saved"});

        res.status(400).json({message:"proposal created successfully"})

            async function storeProposalInDb(word, meaning, encryptedWord, encryptedMeaning, encryptedAESKey, userAddress) {
                
                const newProposal = new proposal({
                    encrypted_data: encryptedWord, // assuming encrypted word data
                    onchain_proposal_id: 'some_id', // you need to fetch this dynamically
                    status: 'pending',
                    created_by: userAddress,
                });
                await newProposal.save();
            }
        });

        app.get('/get-word/:word_id', async (req,res)=>{
            const {word_id}=req.params; //word id
            const {userAddress}=req.query; //eth address

            //1. user has permission?
            const hasPermission=await checkUserPermissions(userAddress);
            if(!hasPermission){
                return res.status(403).json({message:'Access Denied'});
            }
            //2. get proposal from db
            const {encryptedWord, encryptedMeaning, encryptedAESKey, wordIv, meaningIv}=await getProposal(word_id);

            //3. Decrypt AES key using RSA (user's private key)
            const userPrivateKey=await getUserPrivateKey(userAddress);
            const aesKey=decryptRSA(encryptedAESKey, userPrivateKey);

            //4. Decrypt data using AES
            const decryptedWord=decryptAES(encryptedWord, aesKey,wordIv);
            const decryptedMeaning=decryptAES(encryptedMeaning,aesKey,meaningIv);

            res.status(400).json({word:decryptedWord, meaning: decryptedMeaning});

            //function to fetch word from DB
            async function getWordFromDb(word_id){
                console.log(`Fetching ${word_id} from DB`);
                return {
                    encryptedWord: 'encryptedData',
                    encryptedMeaning: 'encryptedMeaning',
                    encryptedAESKey: 'encryptedAESKey',
                    wordIv:'initVector',
                    meaningIv:'initVector'

                };
            }

            //function to check user permissions ???
            async function checkUserPermissions(userAddress){
                const userPermission = await permit.findOne({ user_address: userAddress });
            if (!userPermission) {
                return false; // User does not have permission
    }
    return true; // User has permission
            }

            // async function getUserPublicKey(userAddress){
            //     const permission=await permission.findOne({ user_address: userAddress});
            //     return permission ? permission.public_key: null;
            // }

            // async function getUserPrivateKey(userAddress){
            //     //fetch user's private key from DB
            //     return 'userPrivateKey'; 
            // }

        });