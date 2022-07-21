import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthData } from "./auth-data.model";
import { User } from "./user.model";
import { CompanyProjectService } from '../copmany-project/companyProject.service';


@Injectable()
export class AuthService {
    authChange = new Subject<boolean>();
    private user: User;
    private isAuthenticated = false;

    constructor (private router: Router,
         private auth: AngularFireAuth,
          private comProService: CompanyProjectService,
          private snackbar: MatSnackBar
          ) {}

    
    registerUser(authData: AuthData) {
    this.auth.createUserWithEmailAndPassword(authData.email,authData.password)
    .then ( result => {
        console.log(result);
        this.user= {
            email: authData.email,
            username: authData.username
        };
        this.authSuccessfully();
    })
    .catch (error => {
         this.snackbar.open(error.message, null, {duration: 3000})
     })
    }

    login(authData: AuthData) {

        this.auth.signInWithEmailAndPassword(authData.email, authData.password)
        .then ( result => {
            console.log(result);
            this.user= {
                email: authData.email,
                username: authData.username
            };
            this.authSuccessfully();
        })
        .catch (error => {
            this.snackbar.open(error.message, null, {duration: 3000})
         })
        }

        getUser() {
            console.log(this.user);
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
    }
}