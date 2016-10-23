using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.Security.Cryptography;
using Windows.Security.Cryptography.Core;
using Windows.Security.Cryptography.DataProtection;
using Windows.Storage.Streams;

namespace BlueYonder.Companion.Client.Helpers
{
    public class EncryptionManager
    {
        private static IBuffer GetMD5Hash()
        {
            IBuffer buffUtf8Msg = CryptographicBuffer.ConvertStringToBinary("BlueYonderCompanion", BinaryStringEncoding.Utf8);
            HashAlgorithmProvider objAlgProv = HashAlgorithmProvider.OpenAlgorithm(HashAlgorithmNames.Md5);
            IBuffer buffHash = objAlgProv.HashData(buffUtf8Msg);
            return buffHash;
        }

        public static string Encrypt(string toEncrypt)
        {
            try
            {
                var keyHash = GetMD5Hash();
                var toDecryptBuffer = CryptographicBuffer.ConvertStringToBinary(toEncrypt, BinaryStringEncoding.Utf8);
                var aes = SymmetricKeyAlgorithmProvider.OpenAlgorithm(SymmetricAlgorithmNames.AesEcbPkcs7);
                var symetricKey = aes.CreateSymmetricKey(keyHash);
                var buffEncrypted = CryptographicEngine.Encrypt(symetricKey, toDecryptBuffer, null);
                var strEncrypted = CryptographicBuffer.EncodeToBase64String(buffEncrypted);

                return strEncrypted;
            }
            catch (Exception ex)
            {
                return "";
            }
        }

        public static string Decrypt(string cipherString)
        {
            try
            {
                var keyHash = GetMD5Hash();

                IBuffer toDecryptBuffer = CryptographicBuffer.DecodeFromBase64String(cipherString);
                SymmetricKeyAlgorithmProvider aes = SymmetricKeyAlgorithmProvider.OpenAlgorithm(SymmetricAlgorithmNames.AesEcbPkcs7);
                var symetricKey = aes.CreateSymmetricKey(keyHash);
                var buffDecrypted = CryptographicEngine.Decrypt(symetricKey, toDecryptBuffer, null);
                string strDecrypted = CryptographicBuffer.ConvertBinaryToString(BinaryStringEncoding.Utf8, buffDecrypted);
                return strDecrypted;
            }
            catch (Exception ex)
            {
                return "";
            }
        }
    }
}
