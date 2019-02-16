import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatFormFieldModule, MatInputModule, MatButtonToggleModule, MatIconModule, MatCardModule, MatButtonModule} from '@angular/material';

import { SubFeatureComponent } from './sub-feature/sub-feature.component';
import { FeatureComponent } from './feature.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    CommonModule,
    MatAutocompleteModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatCardModule

  ],
  declarations: [SubFeatureComponent, FeatureComponent],
  exports: [FeatureComponent]
})
export class FeatureModule { }
