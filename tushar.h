/*
 * Messaging.h
 *
 *  Created on: Jul 5, 2016
 *      Author: vikramgaru
 */

#ifndef MESSAGING_H_
#define MESSAGING_H_
#include<string>
#include<iostream>
#include <sys/types.h>
#include <sys/socket.h>
#include <netdb.h>
#include<errno.h>
#include <arpa/inet.h>
#include<vector>
#include<iomanip>
#define BACKLOG 10
#define NUMBER 1

using namespace std;

class Messaging {
private:
	struct sockaddr_storage their_addr;
	socklen_t addr_size;
	char *_message;
	int s,len,address,n;
	vector<int> store;
	struct addrinfo hints, *res;
public:
	Messaging();
	virtual ~Messaging();
	void send(void *message);
	void received(int *socket);
	void display();
};

#endif /* MESSAGING_H_ */
