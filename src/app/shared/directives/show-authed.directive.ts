import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

import { DataStoreService } from '../../services/data-store.service';

@Directive({
  selector: '[appShowAuthed]'
})
export class ShowAuthedDirective implements OnInit {

  condition: boolean;

  constructor(
    private templateRef: TemplateRef<any>,
    private dataStoreService: DataStoreService,
    private viewContainer: ViewContainerRef,
  ) { }

  @Input() set appShowAuthed(condition: boolean) {
    this.condition = condition;
  }

  ngOnInit(){
    this.dataStoreService.isAuthenticated.subscribe(
      (isAuthenticated: boolean) => {
        if (
          (isAuthenticated && this.condition) ||
          (!isAuthenticated && !this.condition)
        ) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
          this.viewContainer.clear();
        }
      },
    );
  }





}
