import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubFeatureComponent } from './sub-feature/sub-feature.component';
import { FeatureComponent } from './feature.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [SubFeatureComponent, FeatureComponent],
  exports: [FeatureComponent]
})
export class FeatureModule { }
