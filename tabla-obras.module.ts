import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablaObrasComponent } from './tabla-obras.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { FurySharedModule } from 'src/@fury/fury-shared.module';
import { BreadcrumbsModule } from 'src/@fury/shared/breadcrumbs/breadcrumbs.module';
import { ListModule } from 'src/@fury/shared/list/list.module';
import { MaterialModule } from 'src/@fury/shared/material-components.module';
import { UpdateInsertObraModalComponent } from './update-insert-obra-modal/update-insert-obra-modal.component';



@NgModule({
  declarations: [TablaObrasComponent, UpdateInsertObraModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FurySharedModule,
    // Core
    ListModule,
    BreadcrumbsModule,
    MatExpansionModule
  ],
  entryComponents: [TablaObrasComponent],
  exports: [TablaObrasComponent]
})
export class TablaObrasModule { }
