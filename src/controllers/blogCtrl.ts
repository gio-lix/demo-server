import {Request, Response} from "express";
import Blogs from '../moduls/blogModel'
import Comments from "../moduls/commentModule"
import {IReqAuth} from "../config/interface";
import mongoose from "mongoose";





const blogCtrl = {

    getBlogs: async (req: Request, res: Response) => {
        try {
            const blogs = await Blogs.aggregate([
                // User
                {
                    $lookup: {
                        from: "users",
                        let: {user_id: "$user"},
                        pipeline: [
                            {$match: {$expr: {$eq: ["$_id", "$$user_id"]}}},
                            {$project: {password: 0}}
                        ],
                        as: "user"
                    }
                },
                // array -> object
                {$unwind: "$user"},
                // Category
                {
                    $lookup: {
                        "from": "categories",
                        "localField": "category",
                        "foreignField": "_id",
                        "as": "category"
                    }
                },
                // array -> object
                {$unwind: "$category"},
                // Sorting
                {$sort: {"createdAt": -1}},
                // Group by category
                {
                    $group: {
                        _id: "$category._id",
                        name: {$first: "$category.name"},
                        blogs: {$push: "$$ROOT"},
                        count: {$sum: 1}
                    }
                },
                // Pagination for blogs
                {
                    $project: {
                        blogs: {
                            $slice: ['$blogs', 0, 4]
                        },
                        count: 1,
                        name: 1
                    }
                }
            ])
            res.json(blogs)
        } catch (err: any) {
            return res.status(500).json({msg: err.message})
        }
    },


}
export default blogCtrl

