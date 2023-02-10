import { Component } from '@angular/core';
import { MiddleTierService } from '../../services/middle-tier/middle-tier.service';

@Component({
  selector: 'app-middle-tier',
  templateUrl: './middle-tier.component.html',
  styleUrls: ['./middle-tier.component.scss']
})
export class MiddleTierComponent {

  token: string = "";
  /**
   *
   */
  constructor(private middleTierService: MiddleTierService) {
    this.middleTierService.getOboToken()
      .subscribe(resp => 
        this.token = resp.access_token);
  }
}
