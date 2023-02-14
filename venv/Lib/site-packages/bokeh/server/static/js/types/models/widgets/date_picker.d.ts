import flatpickr from "flatpickr";
import { InputWidget, InputWidgetView } from "./input_widget";
import { StyleSheetLike } from "../../core/dom";
import { CalendarPosition } from "../../core/enums";
import * as p from "../../core/properties";
declare type DateStr = string;
declare type DatesList = (DateStr | [DateStr, DateStr])[];
export declare class DatePickerView extends InputWidgetView {
    model: DatePicker;
    private _picker?;
    connect_signals(): void;
    remove(): void;
    styles(): StyleSheetLike[];
    render(): void;
    protected _on_change(_selected_dates: Date[], date_string: string, _instance: flatpickr.Instance): void;
    protected _position(self: flatpickr.Instance, custom_el: HTMLElement | undefined): void;
}
export declare namespace DatePicker {
    type Attrs = p.AttrsOf<Props>;
    type Props = InputWidget.Props & {
        value: p.Property<string>;
        min_date: p.Property<string | null>;
        max_date: p.Property<string | null>;
        disabled_dates: p.Property<DatesList | null>;
        enabled_dates: p.Property<DatesList | null>;
        position: p.Property<CalendarPosition>;
        inline: p.Property<boolean>;
    };
}
export interface DatePicker extends DatePicker.Attrs {
}
export declare class DatePicker extends InputWidget {
    properties: DatePicker.Props;
    __view_type__: DatePickerView;
    constructor(attrs?: Partial<DatePicker.Attrs>);
}
export {};
//# sourceMappingURL=date_picker.d.ts.map