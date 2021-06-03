import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit, OnDestroy {
  constructor(private authService: AuthService) {}
  private authListenerSubs: Subscription;
  private currentUser: Subscription;
  public user: object;
  userIsAuthenticated = false;

  onLogout() {
    this.authService.logout();
  }

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((response) => {
        this.userIsAuthenticated = response;
      });

    this.currentUser = this.authService.getCurrentUser().subscribe((user) => {
      this.user = user;
      this.authService.getMyUser();
    });
  }
  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
