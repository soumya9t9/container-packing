import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContainerComponent } from './container/container.component';
import { PocComponent } from './poc/poc.component';

const routes: Routes = [
  {
    path: "",
    component: ContainerComponent
  },
  {
    path: "poc",
    component: PocComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
