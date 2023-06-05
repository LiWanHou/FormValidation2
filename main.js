function Validator(formSelector){
    var _this = this
    var formRules = {}

    var validatorRules = {
        required: function(value) {
            return value.trim() ? undefined : 'Vui lòng nhập trường này'
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
                var ruleFunc = validatorRules[rule]

                if (rule.includes(':')){
                    var ruleInfo = rule.split(':')
                    rule = ruleInfo[0]
                    ruleFunc = validatorRules[rule](ruleInfo[1])
                }

                if (Array.isArray(formRules[input.name])){
                    formRules[input.name].push(ruleFunc)
                } else {
                    formRules[input.name] = [ruleFunc]
                }
            })

            input.onblur = Validate
            input.oninput = () => {
                var formGroup = input.closest('.form-group')
                formGroup.querySelector('.form-message').innerText = ''
                formGroup.classList.remove('invalid')
            }
        })
    }

    function Validate(e){
        var rules = formRules[e.target.name]

        var errorMessage
        rules.some(function(rule){
            errorMessage = rule(e.target.value)    
            return errorMessage
        })
        
        if (errorMessage) {
            var formGroup = e.target.closest('.form-group')
            if (formGroup) {
                formGroup.querySelector('.form-message').innerText = errorMessage
                formGroup.classList.add('invalid')
            } else {
                formGroup.querySelector('.form-message').innerText = ''
                formGroup.classList.remove('invalid')
            }
        }
        return !errorMessage
    }

    formElement.onsubmit = function(e) {
        e.preventDefault()

        var isValid = true
        var inputs = formElement.querySelectorAll('[name][rules]')
        inputs.forEach((input) =>{
            
            if (!Validate({target: input})) {
                isValid = false
            }
        }) 

        if (isValid) {
            if (typeof _this.onSubmit === 'function') {
                var enableInputs = formElement.querySelectorAll('[name]')
                var formValues = Array.from(enableInputs).reduce((values, input) => {
                    switch(input.type) {
                        case 'radio':
                            // values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value;
                            // break;
                        case 'checkbox':
                            if (!input.matches(':checked')) {
                                // values[input.name] = '';
                                return values;
                            }
                            if (!Array.isArray(values[input.name])) {
                                values[input.name] = [];
                            }
                            values[input.name].push(input.value);
                            break;
                        case 'file':
                            values[input.name] = input.files;
                            break;
                        default:
                            values[input.name] = input.value;
                    }
                    return values
                }, {})
                _this.onSubmit(formValues)
            } else {
                formElement.submit()
            }
        } 
    }
}