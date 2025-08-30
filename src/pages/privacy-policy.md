# Privacy Policy

*Last updated: August 29, 2025*

## Overview

Pinepods is an open-source, self-hosted podcast management system released under the GNU General Public License v3.0 (GPL-3). This privacy policy explains how data is handled when you use Pinepods.

## The Self-Hosted Nature

**Important**: Pinepods is designed to be self-hosted, meaning you run it on your own server infrastructure. This fundamentally changes the privacy landscape compared to traditional hosted services:

- **You control your data**: All podcast subscriptions, listening history, user accounts, and preferences are stored on servers you control
- **No external data collection**: The Pinepods software itself does not collect, transmit, or share your data with external parties
- **Your responsibility**: Data privacy and security are determined by how you configure and maintain your Pinepods instance

## Data Storage and Processing

### What Data is Stored Locally

When you use Pinepods, the following information is stored on your self-hosted instance:

- **User account information**: Usernames, email addresses (if provided), and securely hashed passwords
- **Podcast subscriptions**: Lists of podcasts you've subscribed to
- **Listening history**: Episode play progress, completion status, and playback positions
- **User preferences**: Theme settings, playback preferences, and application configurations
- **API keys**: Generated keys for accessing Pinepods functionality programmatically
- **RSS feed data**: Cached podcast episode information fetched from external RSS feeds

### External Data Sources

Pinepods fetches publicly available data from:

- **Podcast RSS feeds**: Episode information, descriptions, and audio file locations
- **Podcast indexes**: Search functionality may query external podcast directories (like Podcast Index API)
- **Chapter and transcript data**: When available from podcast feeds

## No External Analytics or Tracking

Pinepods does not include:

- Analytics tracking (Google Analytics, etc.)
- External advertising networks
- Third-party user tracking
- Data transmission to developers or other parties

## Your Responsibilities as a Self-Hoster

Since you control your Pinepods instance, you are responsible for:

- **Server security**: Keeping your server and Pinepods installation secure and updated
- **Data backups**: Implementing backup strategies for your data
- **Access controls**: Managing user accounts and permissions appropriately
- **Legal compliance**: Ensuring your use complies with applicable laws in your jurisdiction

## Multi-User Environments

If you provide Pinepods access to other users:

- Each user's data is separated within the application
- As the instance administrator, you have technical access to all data stored on your server
- You should inform users about your data handling practices
- Consider implementing your own terms of service for your users

## Data Retention

- Data is retained indefinitely on your server unless you actively delete it
- Users can delete their own accounts and associated data through the application
- Administrators can manage user data through administrative functions

## Third-Party Integration

Pinepods may integrate with external services you choose to configure:

- **Authentication providers**: If you enable OIDC/OAuth integration
- **Notification services**: If you configure external notification systems
- **Podcast directories**: When searching for new podcasts

When using these integrations, you should review the privacy policies of those external services.

## Changes to This Policy

This privacy policy may be updated as Pinepods evolves. Check the documentation for the most current version. As an open-source project, all changes are publicly visible in the project repository.

## Contact and Support

For questions about privacy in Pinepods:

- Review the [open-source code](https://github.com/madeofpendletonwool/PinePods) to understand exactly how data is handled
- Report security concerns through the project's GitHub repository
- Participate in community discussions about privacy and security

## GPL-3 License Implications

Under the GPL-3 license:

- You have the right to examine, modify, and redistribute the Pinepods source code
- Any modifications you make must also be released under GPL-3 if distributed
- You can verify exactly how your data is being processed by reviewing the source code

---

**Remember**: The privacy of your Pinepods data is primarily determined by how you secure and configure your self-hosted instance, not by the Pinepods software itself.