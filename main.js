function Validator(formSelector){
    var formRules = {}

    var validatorRules = {
        required: function(value) {
            return value.trim() ? undefined : message || 'Vui lòng nhập trường này'
        },
        email: function(value){
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regex.test(value) ? undefined : 'Vui lòng nhập email'
        },
        min: function(min){
            return function(value){
                return value.length >= min  ? undefined : `Phải nhập tối thiểu ${min} kí tự`
            }
        }
    }

    var formElement = document.querySelector(formSelector)
    if (formElement){
        var inputs = formElement.querySelectorAll('[name][rules]')
        inputs.forEach((input) => { 
            var rules = input.getAttribute('rules').split('|')
            rules.forEach((rule) => {
                if (rule.includes(':')){
                    var ruleInfo = rule.split(':')
                    var rule = ruleInfo[0]
                }
                if (Array.isArray(formRules[input.name])){
                    formRules[input.name].push(rule)
                } else {
                    formRules[input.name] = []
                }
            })
        })
        console.log(formRules)
    }
}