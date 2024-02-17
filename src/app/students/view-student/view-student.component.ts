import { Component, OnInit } from '@angular/core';
import { StudentService } from '../student.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from 'src/app/models/ui-models/student.model';
import { GenderService } from 'src/app/services/gender.service';
import { Gender } from 'src/app/models/ui-models/gender.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-view-student',
  templateUrl: './view-student.component.html',
  styleUrls: ['./view-student.component.css']
})
export class ViewStudentComponent implements OnInit {

  studentId: string | null | undefined;
  student: Student = {
    id: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    mobile: 0,
    genderId: '',
    profileImageUrl: '',
    gender: {
      id: '',
      description: ''
    },
    address: {
      id: '',
      physicalAddress: '',
      postalAddress: ''
    }
  };
  genderList: Gender[] = [];

  constructor(private studentService: StudentService, private readonly route: ActivatedRoute,
    private readonly genderService: GenderService,
    private snackBar: MatSnackBar,
    private router: Router) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe(
      (params) => {
        this.studentId = params.get('id');
      }
    )

    if (this.studentId) {
      this.studentService.getStudent(this.studentId).subscribe(
        (SuccessResponse) => {
          this.student = SuccessResponse;
        },
        (errorResponse) => {
          console.log(errorResponse);
        }
      );
    }

    this.genderService.getGenderList()
      .subscribe(
        (successResponse) => {
          this.genderList = successResponse;
        }
      );

  }

  onUpdate(): void {
    //call student service to update
    this.studentService.updateStudent(this.student.id, this.student)
      .subscribe(
        (successResponse) => {
          this.snackBar.open('Student updated successfully', undefined, {
            duration: 2000
          });
        },
        (err) => {

        }
      )
  }

  onDelete(): void {
    this.studentService.deleteStudent(this.student.id).subscribe(
      (successResponse) => {
        this.snackBar.open('Student deleted successfully', undefined, {
          duration: 2000
        });

        setTimeout(() => {
          this.router.navigateByUrl('students');
        }, 2000);

      },
      (errorResponse) => {
        console.log(errorResponse);
      }
    )

  }

}
