import { parsePastedCards } from '../lib/layout/parser';
import { runLayoutPipeline, DEFAULT_LAYOUT_SETTINGS } from '../lib/layout';

const userText = `1. What is Python?
Answer:
Python is a high-level programming language.
It was created by Guido van Rossum.
Python was first released in 1991.
It has a simple and readable syntax.
Python is an interpreted programming language.
It supports object-oriented programming.
It also supports procedural and functional programming.
Python is a dynamically typed language.
It provides many built-in libraries and functions.
Python is widely used for web development.
It is also used in data science and machine learning.
Python can be used for automation and scripting.
Django and Flask are popular Python frameworks.
Python is easy to learn for beginners.
Overall, Python is a powerful and widely used programming language.
2. What are the main features of Python?
Answer:
Python has a simple and easy-to-understand syntax.
It is easy to learn for beginners.
Python is an interpreted language.
It is also a dynamically typed language.
Python supports object-oriented programming.
It supports different programming approaches.
Python has a large standard library.
It provides many built-in functions.
Python can run on different operating systems.
It supports modules and packages.
Python provides automatic memory management.
It supports exception handling.
Python can be used for many types of applications.
It has a large developer community.
These features make Python a popular programming language.
3. What is a variable in Python?
Answer:
A variable is used to store a value in a program.
Python does not require us to declare the variable type separately.
The type is automatically decided based on the value.
For example, we can write x = 10.
Here, the variable x stores the value 10.
We can also store text in a variable.
For example, name = "Aibin" stores a string.
A variable can store different types of data.
The value of a variable can be changed during execution.
For example, x = 10 can later become x = 20.
We should use meaningful names for variables.
A variable name cannot start with a number.
Python variable names are case-sensitive.
For example, age and Age are different variables.
Variables help us store and use data in a program.
4. What are data types in Python?
Answer:
Data types define the type of value stored in a variable.
Python provides several built-in data types.
Integer is used to store whole numbers.
Float is used to store decimal numbers.
String is used to store text.
Boolean is used to store True or False values.
List is used to store multiple values in an ordered collection.
Tuple is also used to store multiple values.
Set is used to store unique values.
Dictionary stores data in key-value pairs.
Python also supports complex numbers.
The type() function can be used to check the data type.
Different data types are used for different purposes.
Understanding data types is important in programming.
They help us work correctly with different kinds of data.
5. What is a list in Python?
Answer:
A list is used to store multiple values in Python.
Lists are ordered collections of elements.
Lists are mutable, which means they can be changed.
A list can contain different types of values.
For example, [10, 20, 30] is a list.
Each element in a list has an index.
Python list indexing starts from zero.
We can access an element using its index.
We can add elements using the append() method.
We can remove elements using methods such as remove().
We can also update existing elements in a list.
A list can contain duplicate values.
We can use loops to process list elements.
Lists are commonly used to store collections of data.
Therefore, lists are one of the most useful data types in Python.`;

const parsed = parsePastedCards(userText);
console.log('Parsed cards count:', parsed.length);
parsed.forEach((c, i) => {
  console.log(`Card ${i + 1}:`);
  console.log('  Q:', c.question);
  console.log('  A preview:', c.answer.slice(0, 60) + '...');
});
