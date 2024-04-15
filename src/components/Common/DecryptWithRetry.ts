import CryptoJS from "crypto-js";

export const DecryptWithRetry = async (encryptedData:string, maxRetries = 2, delay = 1000) => {
  const secretKey = 'secret_key';
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const bytes = CryptoJS.AES.decrypt(decodeURIComponent(encryptedData), secretKey);
      const originalText = bytes.toString(CryptoJS.enc.Utf8);
      if (originalText) {
        return originalText;
      }
    } catch (error) {
      console.error(`복호화 시도 ${attempt} 실패 하였습니다!:`, error);
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        alert("잠시 후 재시도 해주세요.")
        window.location.reload();
        return null;
      }
    }
  }
};
