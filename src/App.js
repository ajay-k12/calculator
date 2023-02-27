import React, { useReducer, useState } from 'react'
import DigitButton from './DigitButton'
import OperationButton from './OperationButton'
import './App.css'
import DarkModeToggle from 'react-dark-mode-toggle'


export const ACTIONS = {
    ADD_DIGIT: 'add-digit',
    CHOOSE_OPERATION: 'choose-operation',
    CLEAR: 'clear',
    DELETE_DIGIT: 'delete-digit',
    EVALUATE: 'evaluate'
}

const INTEGER_FORMATTER = new Intl.NumberFormat('en-us', {
    maximumFractionDigits: 0
})
function formatOperand(operand){
    if(operand==null) return 
    const [integer, decimal] = operand.split('.')
    if(decimal==null) return INTEGER_FORMATTER.format(integer)
    return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

const evaluate = ({currentOperand, previousOperand, operation}) => {
    const prev = parseFloat(previousOperand);
    const curr = parseFloat(currentOperand);
    if(isNaN(prev) || isNaN(curr)) return ''
    let computation = ''
    switch (operation){
        case '+':
            computation = prev + curr;
            break;
        case '-':
            computation = prev - curr;
            break;
        case '*':
            computation = prev * curr;
            break;
        case '/':
            computation = prev / curr;
            break;
        default:
            return computation
    } 
    return computation.toString();
}

const reducer = (state, {type, payload}) => {
    switch(type) {
        case ACTIONS.ADD_DIGIT:
            if(state.overwrite){
                return {
                    ...state,
                    overwrite: false,
                    currentOperand: payload.digit
                }
            }
            if(payload.digit==='0' && state.currentOperand==='0'){
                return state;
            }
            if(payload.digit==='.' && state.currentOperand==null){
                return {
                    ...state,
                    currentOperand: '0' + payload.digit
                }
            }
            if(payload.digit==='.' && state.currentOperand.includes('.')){
                return state;
            }
            return {
                ...state,
                currentOperand: `${state.currentOperand || ''}${payload.digit}`
            }

        case ACTIONS.CLEAR:
                return {}

        case ACTIONS.CHOOSE_OPERATION:
            if(state.currentOperand==null && state.previousOperand==null){
                return state;
            }
            if(state.currentOperand==null){
                return {
                    ...state,
                    operation: payload.operation
                }
            }
            if(state.previousOperand==null){
                return {
                    ...state,
                    currentOperand: null,
                    previousOperand: state.currentOperand,
                    operation: payload.operation
                }
            }
            return {
                ...state,
                previousOperand: evaluate(state),
                operation: payload.operation,
                currentOperand: null
            }
        case ACTIONS.EVALUATE:
            if(state.operation==null || state.currentOperand==null || state.previousOperand==null){
                return state;
            }
            return {
                ...state,
                overwrite: true,
                previousOperand: null,
                operation: null,
                currentOperand: evaluate(state)
            }
        
        case ACTIONS.DELETE_DIGIT:
            if(state.previousOperand!=null && state.currentOperand==null) return state
            if(state.previousOperand==null && state.currentOperand==null) return state
            if(state.overwrite){
                return {
                    ...state,
                    overwrite: false,
                    currentOperand: null
                }
            }
            if(state.currentOperand.length === 1)
            return {...state, currentOperand: null}
            return {
                ...state,
                currentOperand: state.currentOperand.slice(0, -1)
            }
    }
}

const App = () => {
    const[{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {})

    const [checked, setChecked] = useState( false);
    const toggleButton = () => {
        if(checked === true){
            setChecked(false)
            document.body.className = 'light';
        }
        else{
            setChecked(true)
            document.body.className = 'dark';
        }
    }

  return (
    <div className={`container ${checked===false ? 'light' : 'dark'}`}>
        <div className='toggleButton'>
            <DarkModeToggle size={50} className='togButton' checked={checked} onChange={toggleButton} speed={3} />
        </div>
        <div className={`calculator-grid ${checked===false ? 'light' : 'dark'}`}>
            <div className={`output ${checked===false ? 'light' : 'dark'}`}>
                <div className='previous-operand'>{formatOperand(previousOperand)} {operation}</div>
                <div className='current-operand'>{formatOperand(currentOperand)}</div>
            </div>
            <button onClick={() => dispatch({type: ACTIONS.CLEAR})} className='span-two'>AC</button>
            <button onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT})}>DEL</button>
            <OperationButton operation='/' dispatch={dispatch} />
            <DigitButton digit='1' dispatch={dispatch} />
            <DigitButton digit='2' dispatch={dispatch} />
            <DigitButton digit='3' dispatch={dispatch} />
            <OperationButton operation='*' dispatch={dispatch} />
            <DigitButton digit='4' dispatch={dispatch} />
            <DigitButton digit='5' dispatch={dispatch} />
            <DigitButton digit='6' dispatch={dispatch} />
            <OperationButton operation='+' dispatch={dispatch} />
            <DigitButton digit='7' dispatch={dispatch} />
            <DigitButton digit='8' dispatch={dispatch} />
            <DigitButton digit='9' dispatch={dispatch} />
            <OperationButton operation='-' dispatch={dispatch} />
            <DigitButton digit='.' dispatch={dispatch} />
            <DigitButton digit='0' dispatch={dispatch} />
            <button onClick={() => dispatch({type: ACTIONS.EVALUATE})} className='span-two'>=</button>
        </div>
    </div>
  )
}

export default App