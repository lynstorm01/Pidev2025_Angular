import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { Inject } from '@angular/core';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {

  email: string = '';
  password: string = '';

  constructor(private authService: AuthService,@Inject(CookieService) private cookieService: CookieService) { }

  login(): void {
    if(this.email===''){
      alert("Please enter your email");
    }
  else if(this.password===''){
      alert("Please enter your password");
    }
  else{
    this.authService.login(this.email, this.password)
      .subscribe(
        response => {
          // Handle successful login response
          // Store the token in a cookie
          this.cookieService.set('token', response.token);
          
          // Check if the role in the token is ROLE_TEACHER
          const token = response.token;
          const decodedToken = this.decodeToken(token);
          console.log(decodedToken)
          if (decodedToken && decodedToken.role === 'ROLE_ADMIN') {
            // Redirect to the teacher page
            window.location.href = '/admin';
          } else if (decodedToken && decodedToken.role === 'ROLE_USER'){
            // Redirect to the default page
            window.location.href = '/create';
          }
          else{
            window.location.href = '/signin';
          }
        },
        error => {
          // Handle error response
          alert("Email Or Password Incorrect")
        }
      );
    }
  }

  decodeToken(token: string): any {
    try {
      const tokenPayload = token.split('.')[1];
      const decodedToken = JSON.parse(atob(tokenPayload));
      return decodedToken;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  ngOnInit(): void {
  }

}
