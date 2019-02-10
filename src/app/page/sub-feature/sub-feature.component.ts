import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sub-feature',
  templateUrl: './sub-feature.component.html',
  styleUrls: ['./sub-feature.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubFeatureComponent {

  @Input() todos: any;

}
