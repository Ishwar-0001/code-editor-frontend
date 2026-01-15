const DataAPI = import.meta.env.VITE_BACKEND_URL;

const api = {
  Code: {
    addQuestion: `${DataAPI}/code/add`,
    getAllQuestions: `${DataAPI}/code/questions`,
    getQuestionById: (id) => `${DataAPI}/code/questions/${id}`,
    runCode: `${DataAPI}/code/run`,
  },
};

export default api;
