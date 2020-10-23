import { NgModule } from '@angular/core';
import { DateFormat } from './dateformat.pipe';
import { TimeFormat } from './timeformat.pipe';

@NgModule({
  declarations: [DateFormat, TimeFormat],
  exports: [DateFormat, TimeFormat],
})
export class PipeModule {}
