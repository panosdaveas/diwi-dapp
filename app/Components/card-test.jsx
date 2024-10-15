import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Button,
    Textarea,
} from "@material-tailwind/react";
import {
    CircleStackIcon,
    StopCircleIcon
    
} from "@heroicons/react/24/outline";
import { TextareaCustom } from "./textarea";

const TABLE_HEAD = ["Name", "Job", "Employed", ""];

const TABLE_ROWS = [
    {
        name: "John Michael",
        job: "Manager",
        date: "23/04/18",
    },
    {
        name: "Alexa Liras",
        job: "Developer",
        date: "23/04/18",
    },
    {
        name: "Laurent Perrier",
        job: "Executive",
        date: "19/09/17",
    },
    {
        name: "Michael Levi",
        job: "Developer",
        date: "24/12/08",
    },
    {
        name: "Richard Gran",
        job: "Manager",
        date: "04/10/21",
    },
];


export function CardTest() {
    return (
        <div>
        <Card className="mt-6 mb-6 w-96 bg-bkg rounded-sm text-content border-4 border-solid border-black shadow-3xl">
            <CardHeader className="bg-gray-300 shadow-none relative m-0 p-0 rounded-sm border-b-4 border-black">
                <div className="flex items-center justify-end p-2 gap-2">
                    <div className="w-4 h-4 bg-white border-4 rounded-full border-solid border-black"></div>
                    <div className="w-4 h-4 bg-yellow-200 border-4 rounded-full border-solid border-black"></div>
                    <div className="w-4 h-4 bg-red-200 border-4 rounded-full border-solid border-black"></div>
                </div>
            </CardHeader>
            <CardBody>
                <Typography variant="h5" className="mb-2">
                    UI/UX Review Check
                </Typography>
                <Typography>
                    The place is close to Barceloneta Beach and bus stop just 2 min by
                    walk and near to &quot;Naviglio&quot; where you can enjoy the main
                    night life in Barcelona.
                </Typography>
            </CardBody>
            <CardFooter className="pt-0">
                <Button className="rounded-sm">Read More</Button>
            </CardFooter>
        </Card>

        <div className="h-full w-full mb-6 py-4 pr-4 shadow-none rounded-none border-b border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark text-text-light dark:text-text-dark">
            <Card className="w-full bg-bkg rounded-sm text-content border-4 border-solid border-black shadow-3xl">
                <CardHeader className="bg-gray-300 shadow-none relative m-0 p-0 rounded-sm border-b-4 border-black">
                    <div className="flex items-center justify-end p-2 gap-2">
                        <div className="w-4 h-4 bg-white border-4 rounded-full border-solid border-black"></div>
                        <div className="w-4 h-4 bg-yellow-200 border-4 rounded-full border-solid border-black"></div>
                        <div className="w-4 h-4 bg-red-200 border-4 rounded-full border-solid border-black"></div>
                    </div>
                </CardHeader>
                <CardBody className="px-0">
                    <Typography variant="h5" className="mb-2 px-6">
                        UI/UX Review Check
                    </Typography>
                    <Typography className="px-6">
                        The place is close to Barceloneta Beach and bus stop just 2 min by
                        walk and near to &quot;Naviglio&quot; where you can enjoy the main
                        night life in Barcelona.
                    </Typography>
                        <table className="w-full min-w-max table-responsive text-left">
                            <thead>
                                <tr>
                                    {TABLE_HEAD.map((head) => (
                                        <th
                                            key={head}
                                            className="border-b-4 border-black bg-blue-gray-50 py-4 px-6"
                                        >
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal leading-none opacity-70"
                                            >
                                                {head}
                                            </Typography>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {TABLE_ROWS.map(({ name, job, date }, index) => {
                                    const isLast = index === TABLE_ROWS.length - 1;
                                    const classes = isLast ? "py-4 px-6" : "py-4 px-6 border-b-4 border-black";

                                    return (
                                        <tr key={name}>
                                            <td className={classes}>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                >
                                                    {name}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                >
                                                    {job}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                >
                                                    {date}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography
                                                    as="a"
                                                    href="#"
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-medium"
                                                >
                                                    Edit
                                                </Typography>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                </CardBody>
                <CardFooter className="pt-0">
                </CardFooter>
            </Card>
            </div>
        </div>
    );
}
