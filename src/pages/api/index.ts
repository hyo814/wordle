import axios from 'axios';

export const dictionaryCheck = async (word:string) => {
  try {
    const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: "단어를 찾을 수 없습니다." };
  }
};
