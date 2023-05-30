function Validator(options){
    function getParent(element, selector){
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement
            }
            element = element.parentElement
       }
    }

    var selectorRules = {}
    
    function validate(inputElement, rule){
        var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector)
        var errorMessage

        var rules = selectorRules[rule.selector]

        for (var i = 0; i < rules.length; i++) {
            switch (inputElement.type) {
                case 'radio':
                    // errorMessage = rules[i](formElement.querySelector(rule.selector + ':checked'))
                    // break
                case 'checkbox':
                    errorMessage = rules[i](formElement.querySelector(rule.selector + ':checked'))
                    break
                default:
                    errorMessage = rules[i](inputElement.value)
            }
            if (errorMessage) break
        }

        if (errorMessage){
            errorElement.innerText = errorMessage
            getParent(inputElement, options.formGroupSelector).classList.add('invalid')
        } else {
            errorElement.innerText = ''
            getParent(inputElement, options.formGroupSelector).classList.remove('invalid')

        }
        return !errorMessage
    }

    var formElement = document.querySelector(options.form);
    if (formElement){
        // Lắng nghe sự kiện submit
        formElement.onsubmit = (e) => {
            e.preventDefault()

            var isFormValid = true

            options.rules.forEach((rule) => {
                var inputElement = formElement.querySelector(rule.selector)
                var isValid = validate(inputElement, rule)
                if (!isValid){
                    isFormValid = false
                }
            })

            if (isFormValid){
                // Trường hợp submit với javascript
                if (typeof options.onSubmit === 'function'){
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
                    options.onSubmit(formValues)
                }
                // Trường hợp submit với hành vi mặc định
                else {
                    formElement.submit()
                } 
            }
        }

        // Lặp qua các rule và xử lí các sự kiện (blur, input)
        options.rules.forEach((rule)=>{
            
            if (Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test)
            } else {
                selectorRules[rule.selector] = [rule.test]
            }
            
            var inputElements = formElement.querySelectorAll(rule.selector)

            Array.from(inputElements).forEach((inputElement) => {
                inputElement.onblur = () => {
                    validate(inputElement, rule)
                }

                inputElement.oninput = () => {
                    var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector)
                    errorElement.innerText = ''
                    getParent(inputElement, options.formGroupSelector).classList.remove('invalid')
                }
            })
        })
    }
}

Validator.isRequired = function(selector, message) {
    return {
        selector: selector,
        test : function(value){
            return value.trim() ? undefined : message || 'Không được bỏ trống trường này'
        }
    }
}
Validator.isRequiredEmail = function(selector, message){
    return {
        selector: selector,
        test : function(value){
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regex.test(value) ? undefined : message
        }
    }
}
Validator.isRequiredPassword = function(selector, min){
    return {
        selector: selector,
        test : function(value){
            return value.length >= min  ? undefined : `Phải nhập tối thiểu ${min} kí tự`
        }
    }
}
Validator.isRequiredChecked = function(selector, message) {
    return {
        selector: selector,
        test : function(value){
            return value ? undefined : message || 'Không được bỏ trống trường này'
        }
    }
}
Validator.isConfirm = function(selector, getpassword, message){
    return {
        selector: selector,
        test : function(value){
            return value === getpassword() ? undefined : message || 'Giá trị xác nhận không khớp'
        }
    }
}