export const menu = "bk-menu"
export const above = "bk-above"
export const below = "bk-below"
export const divider = "bk-divider"
export const active = "bk-active"
export default `:host{position:relative;}.bk-menu{position:absolute;left:0;width:100%;z-index:100;cursor:pointer;font-size:var(--font-size);background-color:#fff;border:1px solid #ccc;border-radius:var(--border-radius);box-shadow:0 6px 12px rgba(0, 0, 0, 0.175);}.bk-menu.bk-above{bottom:100%;}.bk-menu.bk-below{top:100%;}.bk-menu > .bk-divider{height:1px;margin:calc(var(--line-height-computed)/2 - 1px) 0;overflow:hidden;background-color:#e5e5e5;}.bk-menu > :not(.bk-divider){padding:var(--padding-vertical) var(--padding-horizontal);}.bk-menu > :not(.bk-divider):hover,.bk-menu > :not(.bk-divider).bk-active{background-color:#e6e6e6;}`
