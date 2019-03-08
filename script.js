function convert(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

let app = new Vue({
    el: '#app',
    data: {
        index: 0,
        questions: [],
        numRight: 0,
        numWrong: 0,
        loading: true,
        showquestions: false,
        endscreen: false,
    },
    computed: {
        getQuestion() {
            return this.questions[this.index].question;
        },
        getChoices() {
            var choices = [];
            choices = choices.concat(this.questions[this.index].incorrect_answers);
            choices.push(this.questions[this.index].correct_answer);
            return shuffle(choices);
        },
        grade() {
            return (this.numRight / (this.numRight + this.numWrong)) * 100;
        }
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
                let response = await axios.get('https://opentdb.com/api.php?amount=10&category=18&difficulty=medium&type=multiple');

                // Convert special charecters.
                for (var i = 0; i < response.data.results.length; i++) {
                    var obj = response.data.results[i];
                    obj.question = convert(obj.question);
                    obj.correct_answer = convert(obj.correct_answer);
                    for(var j = 0; j < obj.incorrect_answers.length; j++) {
                        obj.incorrect_answers[j] = convert(obj.incorrect_answers[j]);
                    }
                    obj.answered_correctly = false;
                    response.data.results[i] = obj;
                }

                this.questions = response.data.results;

                this.loading = false;
                this.showquestions = true;
                this.number = response.data.num;
            } catch (error) {
                this.loading = false;
                this.number = this.max;
                console.log(error);
            }
        },
        selected(choice) {
            if(choice === this.questions[this.index].correct_answer) {
                this.numRight += 1;
                this.questions[this.index].answered_correctly = true;
            } else {
                this.numWrong += 1;
                this.questions[this.index].answered_correctly = false;
            }

            console.log(this.questions);

            if(this.index < this.questions.length - 1) {
                this.index += 1;
            } else {
                this.showquestions = false;
                this.endscreen = true;
            }
        },
    }
});
