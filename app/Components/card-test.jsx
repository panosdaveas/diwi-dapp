import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Button,
    Textarea,
} from "@material-tailwind/react";
import { TextareaCustom } from "./textarea";

export function CardTest() {
    return (
        <Card className="mt-6 w-96 bg-bkg text-content border border-borderColor">
            <CardHeader color="blue-gray" className="relative h-56">
                <img
                    src="https://images.unsplash.com/photo-1540553016722-983e48a2cd10?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
                    alt="card-image"
                />
            </CardHeader>
            <CardBody>
                <Typography variant="h5" className="mb-2">
                    UI/UX Review Check
                </Typography>
                <TextareaCustom />
                <div class="relative w-full min-w-[200px]">
                    
                    <textarea
                        class="peer h-full min-h-[100px] w-full resize-none rounded-md border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-3 font-sans text-sm font-normal text-content outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-gray-50"
                        placeholder=" "></textarea>
                    <label
                        class="before:content[' '] after:content[' '] 
                        pointer-events-none absolute left-0 -top-1.5 
                        flex h-full w-full select-none text-[11px] 
                        font-normal leading-tight text-content 
                        transition-all before:pointer-events-none 
                        before:mt-[6.5px] before:mr-1 before:box-border 
                        before:block before:h-1.5 before:w-2.5 before:rounded-tl-md 
                        before:border-t before:border-l before:border-blue-gray-200 
                        before:transition-all after:pointer-events-none after:mt-[6.5px] 
                        after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 
                        after:flex-grow after:rounded-tr-md after:border-t after:border-r 
                        after:border-blue-gray-200 after:transition-all 
                        peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] 
                        peer-placeholder-shown:text-content 
                        peer-placeholder-shown:before:border-transparent 
                        peer-placeholder-shown:after:border-transparent 
                        peer-focus:text-[11px] peer-focus:leading-tight 
                        peer-focus:text-content peer-focus:before:border-t-2 
                        peer-focus:before:border-l-2 peer-focus:before:border-gray-900 
                        peer-focus:after:border-t-2 peer-focus:after:border-r-2 
                        peer-focus:after:border-gray-900 peer-disabled:text-transparent 
                        peer-disabled:before:border-transparent 
                        peer-disabled:after:border-transparent 
                        peer-disabled:peer-placeholder-shown:text-content">
                        Textarea Large
                    </label>
                </div>
                
                <Typography>
                    The place is close to Barceloneta Beach and bus stop just 2 min by
                    walk and near to &quot;Naviglio&quot; where you can enjoy the main
                    night life in Barcelona.
                </Typography>
            </CardBody>
            <CardFooter className="pt-0">
                <Button>Read More</Button>
            </CardFooter>
        </Card>
    );
}
