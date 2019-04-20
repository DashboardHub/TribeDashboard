import { Component, OnInit, Input } from '@angular/core';
import { UserSocial } from 'src/app/models/userSocial.model';

@Component({
  selector: 'app-social-cards',
  templateUrl: './social-cards.component.html',
  styleUrls: ['./social-cards.component.scss']
})
export class SocialCardsComponent implements OnInit {

  @Input() userSocial: UserSocial;

  constructor() { }

  ngOnInit() { }

}
