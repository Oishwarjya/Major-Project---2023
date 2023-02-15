export const caret = "bk-caret"
export const down = "bk-down"
export const up = "bk-up"
export const left = "bk-left"
export const right = "bk-right"
export default `:host{--caret-width:4px;}.bk-caret{display:inline-block;vertical-align:middle;width:0;height:0;margin:0 5px;}.bk-caret.bk-down{border-top:var(--caret-width) solid;}.bk-caret.bk-up{border-bottom:var(--caret-width) solid;}.bk-caret.bk-down,.bk-caret.bk-up{border-right:var(--caret-width) solid transparent;border-left:var(--caret-width) solid transparent;}.bk-caret.bk-left{border-right:var(--caret-width) solid;}.bk-caret.bk-right{border-left:var(--caret-width) solid;}.bk-caret.bk-left,.bk-caret.bk-right{border-top:var(--caret-width) solid transparent;border-bottom:var(--caret-width) solid transparent;}`
