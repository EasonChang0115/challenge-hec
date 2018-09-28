(function () {
  Vue.component('step1', {
    template: "#template1",
    props: ['nextstep'],
  })
  Vue.component('step2', {
    template: "#template2",
    props: ['nextstep']
  })
  Vue.component('step3', {
    template: "#template3",
    data: function () {
      return {
        invoiceType: 'electronic'
      }
    },
    methods: {
      changeInvoiceType: function (e) {
        e.preventDefault();
        this.invoiceType = this.invoiceType === 'mailing' ? 'electronic' : 'mailing';
      }
    }
  })
  var vm = new Vue({
    el: '#app',
    data: {
      step: 0,
      stepTitle: [{
          title: '運送',
          component: 'step1',
          complete: true
        }, {
          title: '付款',
          component: 'step2',
          complete: false
        }, {
          title: '發票',
          component: 'step3',
          complete: false
        }
      ]
    },
    methods: {
      NextStep: function() {
        this.stepTitle[this.step].complete = true;
        this.step += 1;
      }
    }
  })
}());
