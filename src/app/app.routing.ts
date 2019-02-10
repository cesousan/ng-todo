import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { FeatureComponent } from "./page/feature.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";


export const AppRouting: Routes = [
  
  { path: 'home', component: HomeComponent },
  { path: 'feature', component: FeatureComponent },
  { path: '**', component: PageNotFoundComponent },
];