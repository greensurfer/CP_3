let app = new Vue({
  el: '#app',
  data: {
    current: {
      question: '',
      correct_answer: '',
      incorrect_answers: []
    },

  },
  computed: {


  },
  watch: {

  },
  created() {
    this.trivia();
  },
  methods: {
    async trivia() {
      try {
        this.loading = true;
        const response = await axios.get('https://opentdb.com/api.php?amount=10&category=18&difficulty=medium&type=multiple');
        this.current = response.data;
        console.log(this.current);
        this.loading = false;
        this.number = response.data.num;
      } catch (error) {
        this.loading = false;
        this.number = this.max;
        console.log(error);
      }
    },

  }
});