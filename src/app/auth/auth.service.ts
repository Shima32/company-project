import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { AuthData } from "./auth-data.model";
import { User } from "./user.model";
import { CompanyProjectService } from '../copmany-project/companyProject.service';
import { UIService } from '../shared/ui.service';


@Injectable()
export class AuthService {
    authChange = new Subject<boolean>();
    private user: User;
    private isAuthenticated = false;

    constructor (private router: Router,
         private auth: AngularFireAuth,
          private comProService: CompanyProjectService,
          private uiService: UIService
          ) {}

    
    registerUser(authData: AuthData) {
    this.auth.createUserWithEmailAndPassword(authData.email,authData.password)
    .then ( result => {
        result.user.updateProfile({
            displayName: authData.username
          })
        this.user= {
            email: authData.email,
            username: authData.username,
            id: result.user.uid
        };
        this.authSuccessfully();
    })
    .catch (error => {
         this.uiService.showSnackbar(error.message, null, 3000);
     })
    }

    login(authData: AuthData) {

        this.auth.signInWithEmailAndPassword(authData.email, authData.password)
        .then ( result => {
            this.user= {
                email: authData.email,
                username: result.user.displayName,
                id: result.user.uid
            };
            this.authSuccessfully();
        })
        .catch (error => {
            this.uiService.showSnackbar(error.message, null, 3000);
         })
        }

        getUser() {
            return {...this.user};
        }

    logout() {
        this.comProService.cancelSubscription();
        this.auth.signOut();
        this.authChange.next(false);
        this.router.navigate(['/login']);
        this.isAuthenticated = false;
    }

    isAuth() {
        return this.isAuthenticated;
    }

    private authSuccessfully (){
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(['/copmany']); 
        this.uiService.showSnackbar(`Hello ${this.user.username}!`, null, 3000);
    }
    
}