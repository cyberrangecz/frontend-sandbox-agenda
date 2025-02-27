import { ImagesPageComponent } from '@crczp/sandbox-agenda/sandbox-images';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
        path: '',
        component: ImagesPageComponent,
    },
];

/**
 * Sandbox images overview routing
 */
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SandboxImagesOverviewRoutingModule {}
