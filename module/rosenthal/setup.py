
from setuptools import setup, find_packages

setup(
    name='rosenthal_amui',
    version='0.1.0',
    packages=find_packages(),
    install_requires=[
        # Add your dependencies here
        # e.g., 'requests>=2.25.1',
    ],
    author='Francis Ogoke',
    author_email='oogoke@andrew.cmu.edu',
    description='Rosenthal Backend for AMUI',
    long_description=open('README.md').read(),
    long_description_content_type='text/markdown',
    license='MIT',
    classifiers=[
        'Programming Language :: Python :: 3',
        'License :: OSI Approved :: MIT License',
        'Operating System :: OS Independent',
    ],
    python_requires='>=3.6',
)
