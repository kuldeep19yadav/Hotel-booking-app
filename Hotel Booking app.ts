// hotel.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Hotel {
  id: number;
  name: string;
  description: string;
  image: string; // URL to the hotel image
  price: number;
  location: string;
  // ... other hotel properties
}

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  private apiUrl = 'assets/hotels.json'; // Or your actual API endpoint

  constructor(private http: HttpClient) { }

  getHotels(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(this.apiUrl);
  }

  getHotelById(id: number): Observable<Hotel> {
    return this.http.get<Hotel>(`${this.apiUrl}/${id}`); // Adjust if needed
  }
}



// hotel-list.component.ts
import { Component, OnInit } from '@angular/core';
import { HotelService } from '../hotel.service';
import { Hotel } from '../hotel.service'; // Import the interface

@Component({
  selector: 'app-hotel-list',
  template: `
    <h2>Hotels</h2>
    <div *ngIf="hotels">
      <div *ngFor="let hotel of hotels">
        <img [src]="hotel.image" alt="{{ hotel.name }}" width="200">
        <h3>{{ hotel.name }}</h3>
        <p>{{ hotel.description }}</p>
        <p>Price: ${{ hotel.price }}</p>
        <button (click)="bookHotel(hotel)">Book Now</button>
      </div>
    </div>
        <div *ngIf="!hotels">Loading Hotels...</div>
    <div *ngIf="error">{{error}}</div>

  `,
  styles: []
})
export class HotelListComponent implements OnInit {
  hotels: Hotel[] | null = null;
  error: string | null = null;

  constructor(private hotelService: HotelService) { }

  ngOnInit(): void {
    this.hotelService.getHotels().subscribe({
      next: (hotels) => {
        this.hotels = hotels;
      },
      error: (error) => {
        console.error('Error fetching hotels:', error);
        this.error = "Error loading hotels"
      }
    });
  }

  bookHotel(hotel: Hotel): void {
    // Implement booking logic here (e.g., navigate to a booking page)
    console.log('Booking hotel:', hotel.name);
    alert("You have booked " + hotel.name + "!");
  }
}


// hotel-details.component.ts (Optional - for displaying details of a specific hotel)
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; // For getting the hotel ID from the URL
import { HotelService } from '../hotel.service';
import { Hotel } from '../hotel.service';

@Component({
  selector: 'app-hotel-details',
  template: `
    <div *ngIf="hotel">
      <h2>{{ hotel.name }}</h2>
      <img [src]="hotel.image" alt="{{ hotel.name }}" width="400">
      <p>{{ hotel.description }}</p>
      <p>Price: ${{ hotel.price }}</p>
      <p>Location: {{ hotel.location }}</p>
      </div>
      <div *ngIf="!hotel">Loading Hotel...</div>
      <div *ngIf="error">{{error}}</div>
  `,
  styles: []
})
export class HotelDetailsComponent implements OnInit {
  hotel: Hotel | null = null;
  error: string | null = null;
  constructor(
    private route: ActivatedRoute,
    private hotelService: HotelService
  ) {}

  ngOnInit(): void {
    const hotelId = +this.route.snapshot.paramMap.get('id')!; // Get ID from URL

    this.hotelService.getHotelById(hotelId).subscribe({
      next: (hotel) => {
        this.hotel = hotel;
      },
      error: (error) => {
        console.error('Error fetching hotel details:', error);
        this.error = "Error loading hotel details";
      }
    });
  }
}



// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { RouterModule, Routes } from '@angular/router'; // Import RouterModule and Routes

import { AppComponent } from './app.component';
import { HotelListComponent } from './hotel-list/hotel-list.component';
import { HotelDetailsComponent } from './hotel-details/hotel-details.component'; // Import the details component
import { HotelService } from './hotel.service';

const routes: Routes = [
  { path: 'hotels', component: HotelListComponent },
  { path: 'hotels/:id', component: HotelDetailsComponent }, // Route for hotel details
  { path: '', redirectTo: '/hotels', pathMatch: 'full' }, // Default route
];


@NgModule({
  declarations: [
    AppComponent,
    HotelListComponent,
    HotelDetailsComponent, // Declare the details component
  ],
  imports: [
    BrowserModule,
    HttpClientModule, // Add HttpClientModule to imports
    RouterModule.forRoot(routes), // Add RouterModule
  ],
  providers: [HotelService],
  bootstrap: [AppComponent]
})
export class AppModule { }


// app.component.ts (Example navigation)
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <nav>
      <a routerLink="/hotels">Hotels</a>
    </nav>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {

}

// Sample hotels.json (in assets folder)
[
  {
    "id": 1,
    "name": "Luxury Hotel",
    "description": "Five-star hotel with amazing views.",
    "image": "https://via.placeholder.com/200", // Replace with actual image URLs
    "price": 299,
    "location": "New York"
  },
  {
    "id": 2,
    "name": "Budget Inn",
    "description": "Affordable and comfortable stay.",
    "image": "https://via.placeholder.com/200",
    "price": 99,
    "location": "Los Angeles"
  },
  // ... more hotels
]