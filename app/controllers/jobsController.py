from fastapi import FastAPI, Response, status, HTTPException, Depends, APIRouter, Request
from typing import Optional
from .. import models, schemas, oauth2
from ..database import database
from ..models import jobs
from ..database import database
from slowapi import Limiter
from slowapi.util import get_remote_address

import math
import re

router = APIRouter(
    prefix="/jobs"
)

limiter = Limiter(key_func=get_remote_address)


@router.get("/", response_model=schemas.JobsManyOut)
async def get_jobs(
        current_user: int = Depends(oauth2.get_current_user),
        limit: int = 10,
        skip: int = 0,
        search: Optional[str] = "",
        status: Optional[str] = "",
        sort: Optional[str] = "",
        jobType: Optional[str] = "",
        page: int = 1):

    jobs_query = jobs.select().where(jobs.c.owner_id == current_user.id)

    result = jobs_query

    # result = result.skip(skip).limit(limit)

    all_jobs = await database.fetch_all(result)

    if status and status != "all":
        all_jobs = [job for job in all_jobs if job['status'] == status]
    if jobType and jobType != "all":
        all_jobs = [job for job in all_jobs if job['jobType'] == jobType]

    if search:
        all_jobs = list(filter(lambda x: re.search(
            search, x["position"]), all_jobs))

    if sort and sort == "latest":
        all_jobs = sorted(
            all_jobs, key=lambda dict: dict['created_at'], reverse=True)
    if sort and sort == "oldest":
        all_jobs = sorted(
            all_jobs, key=lambda dict: dict['created_at'])
    if sort and sort == "a-z":
        all_jobs = sorted(
            all_jobs, key=lambda dict: dict['position'])
    if sort and sort == "z-a":
        all_jobs = sorted(
            all_jobs, key=lambda dict: dict['position'], reverse=True)

    totalJobs = len(all_jobs)

    pagesLimit = totalJobs / limit

    numOfPages = math.ceil(pagesLimit)

    return {"jobs": all_jobs, "totalJobs": totalJobs, "numOfPages": numOfPages}


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.JobOut)
@limiter.limit("10/minute", error_message="Too many requests, please try again later")
async def create_job(job: schemas.JobCreate, request: Request, current_user: int = Depends(oauth2.get_current_user)):

    # make sure in the function it says "request: Request" and not "req: Request", or else the slowapi rate limiter won't work

    if not job.position or not job.company:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Please provide all values")

    query = jobs.insert(values={**job.dict(), "owner_id": current_user.id})

    # the database.execute(query) is what inserts the object into the db, while also retrieving the id at the same time
    created_job_id = await database.execute(query)

    created_job = {**job.dict(), "id": created_job_id}

    return created_job


@router.patch("/{id}", response_model=schemas.JobOut)
@limiter.limit("10/minute", error_message="Too many requests, please try again later")
async def update_job(request: Request, id: int, updating_job: schemas.JobUpdate, current_user: int = Depends(oauth2.get_current_user)):

    job_query = jobs.select().where(jobs.c.id == id)

    job = await database.fetch_one(job_query)

    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Job with id: {id} does not exist")

    if job.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Not authorized to perform requested action")

    updated_job_query = jobs.update().where(jobs.c.id == id).values(
        **updating_job.dict())

    await database.execute(updated_job_query)

    updated_job = {**updating_job.dict(), "id": id}

    return updated_job


@router.delete("/{id}", status_code=status.HTTP_200_OK)
@limiter.limit("10/minute", error_message="Too many requests, please try again later")
async def delete_job(request: Request, id: int, current_user: int = Depends(oauth2.get_current_user)):

    job_query = jobs.select().where(jobs.c.id == id)

    job = await database.fetch_one(job_query)

    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Job with id: {id} does not exist")

    if job.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Not authorized to perform requested action")

    deleted_job = jobs.delete().where(jobs.c.id == id)

    await database.execute(deleted_job)

    return {"msg": "Success! Job removed", "id": id}
